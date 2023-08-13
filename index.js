const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const githubUsername = 'YOUR_USER_NAME';
    const repoName = 'YOUR_REPO_NAME';
    const personalAccessToken = 'YOUR_TOKEN_FROM_GITHUB'; // Replace with your GitHub personal access token

    // Fetch the current file information to get the "sha" value
    const currentFileEndpoint = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/path/to/file.txt`;
    const currentFileResponse = await axios.get(currentFileEndpoint, { headers: { Authorization: `Bearer ${personalAccessToken}` } });
    const currentSha = currentFileResponse.data.sha;

    const commitMessage = `Automatic daily commit on ${new Date().toISOString()}`;
    const commitContent = {
      message: commitMessage,
      content: Buffer.from('Your file content').toString('base64'), // Replace with your file content
      sha: currentSha, // Include the current SHA hash
    };

    const commitEndpoint = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/path/to/file.txt`;

    const headers = {
      Authorization: `Bearer ${personalAccessToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    const response = await axios.put(commitEndpoint, commitContent, { headers });

    if (response.status === 200) { // Change to 200 as 201 might not be applicable for updates
      return {
        statusCode: 200,
        body: 'Commit successful',
      };
    } else {
      console.error('GitHub API error:', response.data);
      return {
        statusCode: response.status,
        body: 'Commit failed: ' + response.data.message,
      };
    }
  } catch (error) {
    console.error('Lambda function error:', error);
    return {
      statusCode: 500,
      body: 'An error occurred: ' + error.message,
    };
  }
};
