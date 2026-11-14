/** Live user dashboard. The local /dashboard home is outdated. */
export const USER_DASHBOARD_URL = 'https://www.shockwavetrading.com/dashboard';

/** Live gauntlet activation page. The local /gauntlet-activation page is outdated. */
export const GAUNTLET_ACTIVATION_URL = 'https://www.shockwavetrading.com/gauntlet-activation';

export function goToUserDashboard() {
  window.location.assign(USER_DASHBOARD_URL);
}
