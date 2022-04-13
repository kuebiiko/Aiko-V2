const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays a song in a voice call')
        .addStringOption(option => option.setName('song').setDescription('song').setRequired(true)),
        
    async execute(interaction) {
        const channel = interaction.member.voice.channel
        if (!channel) {
            interaction.reply('You need to be in a voice channel to play.')
        }
        const song = interaction.options.getString('song')

        music.play({
            interaction: interaction,
            channel: channel,
            song: song
        })
        interaction.reply('now playing')
    }
}