const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Skips current song.')
        .addBooleanOption(option => option.setName('repeat').setDescription('Choose whether the current song will be repeated or a repeated song will stop being repeated').setRequired(true)),
        
    async execute(interaction) {
        const isConnected = await music.isConnected({
            interaction: interaction,
        })
        if (!isConnected) {
            return interaction.reply({content: 'There are no songs playing currently.'})
        } else {
            music.repeat({
                interaction: interaction,
                value: option.getBooleanOption('repeat')
            })
            interaction.reply(':thumbsup:')
        }
        
    }
}