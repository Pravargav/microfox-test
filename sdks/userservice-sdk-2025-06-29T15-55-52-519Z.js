/**
 * @class UserService
 * @classdesc A JavaScript SDK for the userservice application.
 */
class UserService {
  /**
   * @constructor
   * @param {string} baseUrl - The base URL of the userservice API.
   */
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error("Base URL is required.");
    }
    this.baseUrl = baseUrl;
  }

  /**
   * @async
   * @function getUsers
   * @description Retrieves a list of users.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of user objects.
   * @throws {Error} If the request fails.
   */
  async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/users`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  /**
   * @async
   * @function getUser
   * @description Retrieves a specific user by ID.
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<object>} A promise that resolves to a user object.
   * @throws {Error} If the request fails or if the user is not found.
   */
  async getUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * @async
   * @function createUser
   * @description Creates a new user.
   * @param {object} userData - The data for the new user.
   * @returns {Promise<object>} A promise that resolves to the created user object.
   * @throws {Error} If the request fails.
   */
  async createUser(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default UserService;
