const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const ValorantAPI = require("unofficial-valorant-api")
const queryString = require('query-string');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('valorantrank')
        .setDescription('Finds the most recent match from a given Valorant account.')
        .addStringOption(option => option.setName('user').setDescription('First part of your valorant user').setRequired(true))
        .addStringOption(option => option.setName('tag').setDescription('Valorant account tag').setRequired(true)),
    async execute(interaction) {
        await interaction.reply('check console')
        
        const queryName = encodeURIComponent(interaction.options.getString('user'))
        const queryTag = encodeURIComponent(interaction.options.getString('tag'))
        const account = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${queryName}/${queryTag}`);
        const accountData = await account.json();


        if (accountData.status !== 200) {
            console.log(accountData.status)
            console.log(queryName + '#' + queryTag)
            await interaction.editReply('Recieved error - status' + ' ' + accountData.status + ' - ' + accountData.message)
        } else {
            const mmr = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${accountData.data.region}/${accountData.data.puuid}`);
            const mmrData = await mmr.json();
            const rankEmbed = {
                title: `${accountData.data.name}#${accountData.data.tag}'s Rank`,
                thumbnail: {
                    url: accountData.data.card.small
                },
                description: `Currently ${mmrData.data.currenttierpatched} ${mmrData.data.ranking_in_tier}RR. Gained ${mmrData.data.mmr_change_to_last_game}RR last game.`,
                timestamp: new Date()
            }  
            await interaction.editReply({ embeds: [rankEmbed] })
        }
        

    }
}