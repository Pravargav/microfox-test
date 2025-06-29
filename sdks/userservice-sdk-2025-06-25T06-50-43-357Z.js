/**
 * @class UserService
 * @classdesc Represents the UserService SDK.
 */
export default class UserService {

  /**
   * @constructor
   * @param {string} apiKey - The API key for authentication.
   * @param {string} baseUrl - The base URL of the UserService API.
   */
  constructor(apiKey, baseUrl = 'https://api.userservice.com') {
    if (!apiKey) {
      throw new Error('API Key is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * @async
   * @function _request
   * @private
   * @description Helper function to make API requests.
   * @param {string} endpoint - The API endpoint to call.
   * @param {object} options - Request options (method, body, headers).
   * @returns {Promise<any>} - The API response data.
   * @throws {Error} - If the request fails.
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += `: ${errorData.message || JSON.stringify(errorData)}`;
        } catch (parseError) {
          // Failed to parse error response, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }


  /**
   * @async
   * @function getUser
   * @description Retrieves a user by ID.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<object>} - The user object.
   * @throws {Error} - If the user retrieval fails.
   */
  async getUser(userId) {
    if (!userId) {
      throw new Error('User ID is required.');
    }
    return this._request(`/users/${userId}`, {
      method: 'GET',
    });
  }

  /**
   * @async
   * @function createUser
   * @description Creates a new user.
   * @param {object} userData - The data for the new user.
   * @returns {Promise<object>} - The newly created user object.
   * @throws {Error} - If user creation fails.
   */
  async createUser(userData) {
    if (!userData || typeof userData !== 'object' || Object.keys(userData).length === 0) {
      throw new Error('User data is required and must be a non-empty object.');
    }
    return this._request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * @async
   * @function updateUser
   * @description Updates an existing user.
   * @param {string} userId - The ID of the user to update.
   * @param {object} userData - The data to update for the user.
   * @returns {Promise<object>} - The updated user object.
   * @throws {Error} - If user update fails.
   */
  async updateUser(userId, userData) {
    if (!userId) {
      throw new Error('User ID is required.');
    }
     if (!userData || typeof userData !== 'object' || Object.keys(userData).length === 0) {
      throw new Error('User data is required and must be a non-empty object.');
    }
    return this._request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  /**
   * @async
   * @function deleteUser
   * @description Deletes a user by ID.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<void>} - A promise that resolves when the user is deleted.
   * @throws {Error} - If user deletion fails.
   */
  async deleteUser(userId) {
    if (!userId) {
      throw new Error('User ID is required.');
    }
    return this._request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }
}
