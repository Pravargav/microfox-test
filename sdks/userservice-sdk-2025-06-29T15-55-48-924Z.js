/**
 * @class UserService
 * @classdesc A JavaScript SDK for interacting with the UserService API.
 */
class UserService {
  /**
   * @constructor
   * @param {string} baseUrl - The base URL of the UserService API.
   */
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error("Base URL is required.");
    }
    this.baseUrl = baseUrl;
  }

  /**
   * @async
   * @function _fetch
   * @private
   * @description Internal fetch wrapper to handle errors.
   * @param {string} url - The URL to fetch.
   * @param {object} options - The fetch options.
   * @returns {Promise<any>} - The JSON response from the API.
   * @throws {Error} - If the API returns an error status.
   */
  async _fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage += ` - ${JSON.stringify(errorBody)}`;
        } catch (jsonError) {
          // If parsing JSON fails, use the original error message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }


  /**
   * @async
   * @function getUser
   * @description Retrieves a user by ID.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<object>} - The user object.
   * @throws {Error} - If the API returns an error.
   */
  async getUser(userId) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    const url = `${this.baseUrl}/users/${userId}`;
    try {
      return await this._fetch(url);
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  }

  /**
   * @async
   * @function createUser
   * @description Creates a new user.
   * @param {object} userData - The data for the new user.
   * @returns {Promise<object>} - The created user object.
   * @throws {Error} - If the API returns an error.
   */
  async createUser(userData) {
    if (!userData) {
      throw new Error("User data is required.");
    }

    const url = `${this.baseUrl}/users`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    try {
      return await this._fetch(url, options);
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }
    /**
   * @async
   * @function updateUser
   * @description Updates an existing user.
   * @param {string} userId - The ID of the user to update.
   * @param {object} userData - The data to update for the user.
   * @returns {Promise<object>} - The updated user object.
   * @throws {Error} - If the API returns an error.
   */
  async updateUser(userId, userData) {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    if (!userData) {
      throw new Error("User data is required.");
    }

    const url = `${this.baseUrl}/users/${userId}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    try {
      return await this._fetch(url, options);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }
}

export default UserService;
