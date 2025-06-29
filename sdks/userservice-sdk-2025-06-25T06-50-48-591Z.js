/**
 * @module UserService
 */

/**
 * UserService SDK.
 */
export default class UserService {
  /**
   * Creates a new UserService instance.
   * @constructor
   */
  constructor() {
    // Initialize any necessary configuration here.
    this.baseUrl = ''; // Replace with your base URL
  }

  /**
   * Sets the base URL for the API.
   * @param {string} baseUrl - The base URL.
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }


  /**
   * Fetches user data.
   * @async
   * @function getUser
   * @param {string} userId - The ID of the user to fetch.
   * @returns {Promise<object>} - A promise that resolves with the user data, or rejects with an error.
   * @throws {Error} - If the request fails.
   */
  async getUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error; // Re-throw the error for the caller to handle.
    }
  }

  /**
   * Creates a new user.
   * @async
   * @function createUser
   * @param {object} userData - The data for the new user.
   * @returns {Promise<object>} - A promise that resolves with the created user data, or rejects with an error.
   * @throws {Error} - If the request fails.
   */
  async createUser(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Re-throw the error for the caller to handle.
    }
  }

  /**
   * Updates an existing user.
   * @async
   * @function updateUser
   * @param {string} userId - The ID of the user to update.
   * @param {object} userData - The data to update for the user.
   * @returns {Promise<object>} - A promise that resolves with the updated user data, or rejects with an error.
   * @throws {Error} - If the request fails.
   */
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Re-throw the error for the caller to handle.
    }
  }

  /**
     * Deletes a user.
     * @async
     * @function deleteUser
     * @param {string} userId - The ID of the user to delete.
     * @returns {Promise<void>} - A promise that resolves when the user is deleted, or rejects with an error.
     * @throws {Error} - If the request fails.
     */
  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Re-throw the error for the caller to handle.
    }
  }
}
