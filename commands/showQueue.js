const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')
const { MessageEmbed, Message } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Get\'s the server\'s current music queue.'),
    async execute(interaction) {
        const queue = await music.getQueue({
            interaction: interaction
        })
        
        interaction.reply(`Currently playing **'${queue[0].info.title}'** by **${queue[0].info.author}** and requested by **${queue[0].requester.username}#${queue[0].requester.discriminator}**.`)
    }
}