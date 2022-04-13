const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes a paused song.')
        .addStringOption(option => option.setName('song').setDescription('song').setRequired(true)),
        
    async execute(interaction) {
        const isPaused = await music.isPaused({ interaction: interaction });
        if (!isPaused) {
            return interaction.reply({content: 'There are no currently paused songs.'})
        } else {
            music.resume({
                interaction: interaction,
            })
            interaction.reply('Music stopped.')
        }
        
    }
}