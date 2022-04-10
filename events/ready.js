module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`logged in as ${client.user.tag}`)
        client.user.setActivity('gingamingayo', { type: 'LISTENING' });
    }
}