async function getInviteStats(db, guildId, userId) {
    const data = (await db.get(`invites_${guildId}_${userId}`)) || {};
    const regular = data.regular || 0;
    const bonus = data.bonus || 0;
    const left = data.left || 0;
    const fake = data.fake || 0;
    const total = regular + bonus - left - fake;
    return { regular, bonus, left, fake, total };
}

module.exports = { getInviteStats };
