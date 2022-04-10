const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('due-events')
        .setDescription('Replies with the nearest upcoming Notion event.'),
    async execute(interaction) {

        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: {
                property: 'Completed',
                checkbox: {
                    equals: false,
                },
            },
            sorts: [
                {
                    property: 'Date',
                    direction: 'ascending',
                },

            ],
        });

        var arrayLength = response.results.length
        await interaction.deferReply()
        for (var i = 0; i < arrayLength; i++) {
            const course = response.results[i].properties.Course.select.name
            const date = response.results[i].properties.Date.date.start
            const type = response.results[i].properties.Type.select.name
            const name = response.results[i].properties.Name.title[0].text.content
            const url = response.results[i].url

            var pageEmbed = {
                title: name,
                url: url,
                fields: [
                    {
                        name: 'Course',
                        value: course,
                                
                    },
                    {
                        name: 'Due Date',
                        value: date,
                    },
                    {
                        name: 'Assignment Type',
                        value: type,
                    }
                ],
                timestamp: new Date()
            }

            await interaction.followUp({ embeds: [pageEmbed] })
            
        }
        
        
        
},

}
