const fs = require('fs');
const path = require('path');

const premiumConfigPath = path.join(__dirname, '../../../premium.json');

/**
 * Load premium configuration
 */
function loadPremiumConfig() {
    try {
        if (fs.existsSync(premiumConfigPath)) {
            const data = fs.readFileSync(premiumConfigPath, 'utf8');
            return JSON.parse(data);
        }
        return { enabled: false };
    } catch (error) {
        console.error('Error loading premium config:', error);
        return { enabled: false };
    }
}

/**
 * Check if premium system is enabled
 */
function isPremiumEnabled() {
    const config = loadPremiumConfig();
    return config.enabled === true;
}

/**
 * Check if user has premium access (either by role or user ID)
 */
function hasPremiumAccess(member, userId) {
    if (!isPremiumEnabled()) return true; // If premium is disabled, everyone has access

    const config = loadPremiumConfig();

    if (config.premiumUsers && config.premiumUsers.includes(userId)) {
        return true;
    }

    if (member && config.premiumRoles && config.premiumRoles.length > 0) {
        const memberRoles = member.roles.cache;
        const hasPremiumRole = config.premiumRoles.some(roleId => memberRoles.has(roleId));
        if (hasPremiumRole) return true;
    }

    return false;
}

/**
 * Check if command requires premium and if user has access
 * @param {Object} command - The command object
 * @param {Object} member - Discord member object
 * @param {String} userId - User ID
 * @returns {Object} - { allowed: boolean, message: string|null }
 */
function checkCommandPremium(command, member, userId) {
    if (!isPremiumEnabled()) {
        return { allowed: true, message: null };
    }

    if (!command.premiumOnly && !command.premiumTier) {
        return { allowed: true, message: null };
    }

    const config = loadPremiumConfig();

    if (!hasPremiumAccess(member, userId)) {
        return { 
            allowed: false, 
            message: config.messages?.noPremium || '⭐ This command requires premium access.'
        };
    }

    if (command.premiumTier && member) {
        const tier = config.tiers[command.premiumTier];
        if (!tier) {
            return { allowed: true, message: null };
        }

        const memberRoles = member.roles.cache;
        const hasTierRole = tier.roleIds.some(roleId => memberRoles.has(roleId));

        if (!hasTierRole && !config.premiumUsers.includes(userId)) {
            return {
                allowed: false,
                message: config.messages?.wrongTier || '⭐ This command requires a higher premium tier.'
            };
        }
    }

    return { allowed: true, message: null };
}

/**
 * Get user's premium tier
 */
function getUserPremiumTier(member, userId) {
    if (!isPremiumEnabled()) return null;

    const config = loadPremiumConfig();

    // Premium users get highest tier
    if (config.premiumUsers && config.premiumUsers.includes(userId)) {
        return 'vip';
    }

    if (!member) return null;

    const memberRoles = member.roles.cache;

    // Check tiers in order of priority (vip > premium > basic)
    for (const tierName of ['vip', 'premium', 'basic']) {
        const tier = config.tiers[tierName];
        if (tier && tier.roleIds.some(roleId => memberRoles.has(roleId))) {
            return tierName;
        }
    }

    return null;
}

module.exports = {
    loadPremiumConfig,
    isPremiumEnabled,
    hasPremiumAccess,
    checkCommandPremium,
    getUserPremiumTier
};
