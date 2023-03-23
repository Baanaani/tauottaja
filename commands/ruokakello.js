const {setTimeout, setInterval} = require('node:timers/promises');
const { QueryType, useMasterPlayer, useQueue } = require('discord-player');

module.exports = {
    name: 'ruokakello',
    description: 'käynnistä ruokakello!',
    voiceChannel: true,
    options: [
        {
            name: 'ruokakello',
            description: 'aseta ruokakellon aika?',
            type: 3,
            required: true,
        }
    ],

    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;
            if (!channel) return interaction.reply('You are not connected to a voice channel!');

            const ruokakello = interaction.options.getString(`ruokakello`)
            await interaction.reply({content: `Ruokakellon aika on asetettu: ${ruokakello}`, ephemeral: true});

            const player = useMasterPlayer();
            const queue = useQueue(interaction.guild.id);

            const musa1 = './musa1.mp3';
            const ruokis = await player.search(musa1, {
                requestedBy: interaction.user,
                searchEngine: QueryType.FILE,
            });

            let biisit;

            const timestamp = new Date();
            let thours;
            let tminutes;
            let rhours;
            let rminutes;
            let rajastin;
            let alarm;
            let seuraavatauko;
            let randommusa;
            let seko = true;

            function validateTime (time) {
                const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
                return time.match(timeReg)
            }

            if (!validateTime(ruokakello)) {
                await interaction.editReply({content: `Kellonaika ei ollut kelvollinen, 
                ruokatauoksi asetetaan klo 11:15.`, ephemeral: true});
                rhours = 11;
                rminutes = 15;

            } else {
                rhours = ruokakello.split(':')[0];
                rminutes = ruokakello.split(':')[1];
            }

            async function asetaTauko() {
                thours = timestamp.getHours();
                tminutes = timestamp.getMinutes();
                console.log(timestamp.getHours(), timestamp.getMinutes());

                seuraavatauko = random(1, 5);
                console.log(seuraavatauko);
                await interaction.editReply({content: `Seuraava tauko arvottu.`, ephemeral: true});

                if (rhours < thours && rminutes < tminutes ){
                    rhours -= thours;
                    console.log(`Menneisyyden ruokatauon tunnit ${rhours}`);
                    rminutes -= tminutes;
                    console.log(`Menneisyyden ruokatauon minuutit: ${rminutes}`);
                    await interaction.editReply({content: `Ruokatauko meni jo.`, ephemeral: true});
                    alarm = seuraavatauko * 60000;
                } else {
                    rhours -= thours;
                    console.log(`Lasketut tunnit ${rhours}`);
                    rminutes -= tminutes;
                    console.log(`Lasketut minuutit: ${rminutes}`);
                    if ( rminutes < 0) {
                        if (rhours - 1 < 0) {
                            await interaction.editReply({content: `Sattui laskuvirhe.`, ephemeral: true});
                            console.log(`Sattui laskuvirhe ${rhours}`);
                            return;
                        }

                        rminutes += 60;
                        console.log(`Ruokakellon minuutit ${rminutes}`);
                        rhours -= 1;
                        console.log(`Ruokakellon tunnit ${rhours}`);
                        rajastin = rhours * 60;
                        rajastin += rminutes;
                        console.log(`Ruokakellon minuutit ${rajastin}`);

                    } else {
                        console.log(`Minuutit pysyivät positiivisena ${rminutes}`);
                        rajastin = rhours * 60;
                        rajastin += rminutes;
                        console.log(`Ruokakellon minuutit ${rajastin}`);
                    }
                    if (rajastin <= seuraavatauko){
                        alarm = rajastin * 60000;
                        seko = false;
                    } else {
                        alarm = seuraavatauko * 60000;
                        seko = true;
                    }
                }
                console.log(`Millisekunteja hälytykseen: ${alarm}`);
            }

            asetaTauko();

            const interval = 2000;

            (async function() {
                for await (const startTime of setInterval(interval, Date.now())) {
                    const now = Date.now();
                    interaction.editReply({content: `Seuraava tauko on ajastettu`, ephemeral: true});
                    console.log(now);
                    if ((now - startTime) > alarm){
                        taukomusa();
                        break;
                    }
                }
                console.log(Date.now());
            })();

            /*
            setTimeout(60000, 'result').then((res) => {
                console.log(res);  // Prints 'result'
            });
            */

            function taukomusa() {
                if (seko){
                    biisit = queue.getSize();
                    randommusa = random( 0, biisit-1);
                    console.log(`Biisiksi arpoutui: ${randommusa}`);
                    queue.node.resume();
                    queue.node.jump(randommusa);
                } else {
                    return player.play(channel, ruokis, {
                        nodeOptions: {
                            metadata: {
                                channel: interaction.channel,
                                client: interaction.guild?.members.me,
                                requestedBy: interaction.user.username
                            },
                            bufferingTimeout: 5000,
                            leaveOnEnd: false,
                        }
                    })
                }
            }

            function random(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

        } catch (error) {
            console.log(error)
        }
    }
}