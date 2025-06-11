/**
 * @class Instagram
 * @classdesc A JavaScript SDK for the Instagram API.
 */
class Instagram {
  /**
   * @constructor
   * @param {string} accessToken - The access token for the Instagram API.
   */
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error("Access token is required.");
    }
    this.accessToken = accessToken;
    this.baseUrl = "https://api.instagram.com/v1"; // Replace with actual API base URL
  }

  /**
   * @async
   * @function postImage
   * @description Posts an image to Instagram with a caption.
   * @param {string} imageUrl - The URL of the image to post.
   * @param {string} caption - The caption for the image.
   * @returns {Promise<object>} - A promise that resolves with the API response.
   * @throws {Error} - If there is an error posting the image.
   */
  async postImage(imageUrl, caption) {
    try {
      // Simulate API call
      console.log(`Posting image: ${imageUrl} with caption: ${caption}`);
      const response = await fetch(`${this.baseUrl}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: this.accessToken,
          image_url: imageUrl,
          caption: caption,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error posting image:", error);
      throw error;
    }
  }

  /**
   * @async
   * @function getFollowers
   * @description Gets the list of followers for the authenticated user.
   * @returns {Promise<Array<object>>} - A promise that resolves with an array of follower objects.
   * @throws {Error} - If there is an error getting the followers list.
   */
  async getFollowers() {
    try {
      // Simulate API call
      console.log("Getting followers list");
      const response = await fetch(`${this.baseUrl}/users/self/followed-by?access_token=${this.accessToken}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data; // Assuming the API returns followers in a 'data' array
    } catch (error) {
      console.error("Error getting followers:", error);
      throw error;
    }
  }

  /**
   * @async
   * @function searchHashtags
   * @description Searches for hashtags on Instagram.
   * @param {string} hashtag - The hashtag to search for.
   * @returns {Promise<Array<object>>} - A promise that resolves with an array of hashtag objects.
   * @throws {Error} - If there is an error searching for the hashtag.
   */
  async searchHashtags(hashtag) {
    try {
      // Simulate API call
      console.log(`Searching for hashtag: ${hashtag}`);
      const response = await fetch(`${this.baseUrl}/tags/search?q=${hashtag}&access_token=${this.accessToken}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data; // Assuming the API returns hashtags in a 'data' array
    } catch (error) {
      console.error("Error searching hashtags:", error);
      throw error;
    }
  }

  /**
   * @async
   * @function getUserProfile
   * @description Gets the user profile information for the authenticated user.
   * @returns {Promise<object>} - A promise that resolves with the user profile object.
   * @throws {Error} - If there is an error getting the user profile.
   */
  async getUserProfile() {
    try {
      // Simulate API call
      console.log("Getting user profile");
      const response = await fetch(`${this.baseUrl}/users/self?access_token=${this.accessToken}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data; // Assuming the API returns user profile in a 'data' object
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }
}

export default Instagram;
