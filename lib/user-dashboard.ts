/** Live user dashboard. The local /dashboard home is outdated. */
export const USER_DASHBOARD_URL = 'https://www.shockwavetrading.com/dashboard';

export function goToUserDashboard() {
  window.location.assign(USER_DASHBOARD_URL);
}
