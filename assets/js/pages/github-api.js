// GitHub API Module
// Handles fetching repository data with caching and error handling

const CACHE_KEY = 'github_projects_cache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const GITHUB_API_BASE = 'https://api.github.com/repos';

/**
 * Extracts owner and repo name from GitHub URL
 * @param {string} githubUrl - Full GitHub repository URL
 * @returns {object|null} - {owner, repo} or null if invalid
 */
function parseGitHubUrl(githubUrl) {
    if (!githubUrl || githubUrl === '#') return null;

    try {
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;

        return {
            owner: match[1],
            repo: match[2]
        };
    } catch (error) {
        console.warn('Invalid GitHub URL:', githubUrl);
        return null;
    }
}

/**
 * Fetches repository data including stars, watchers, forks, and last commit
 * @param {string} githubUrl - GitHub repository URL
 * @returns {Promise<object>} - {stars, watchers, forks, lastCommit, success, rateLimited?}
 */
async function fetchRepoData(githubUrl) {
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
        return { stars: 0, watchers: 0, forks: 0, lastCommit: null, success: false };
    }

    try {
        const response = await fetch(`${GITHUB_API_BASE}/${parsed.owner}/${parsed.repo}`);

        // Handle rate limiting
        if (response.status === 403 || response.status === 429) {
            console.warn('GitHub API rate limit reached');
            return { stars: 0, watchers: 0, forks: 0, lastCommit: null, success: false, rateLimited: true };
        }

        // Handle 404 (private repo or doesn't exist)
        if (response.status === 404) {
            console.warn(`Repository not found or private: ${parsed.owner}/${parsed.repo}`);
            return { stars: 0, watchers: 0, forks: 0, lastCommit: null, success: false };
        }

        if (!response.ok) {
            return { stars: 0, watchers: 0, forks: 0, lastCommit: null, success: false };
        }

        const data = await response.json();
        return {
            stars: data.stargazers_count || 0,
            watchers: data.watchers_count || 0,
            forks: data.forks_count || 0,
            lastCommit: data.pushed_at ? new Date(data.pushed_at) : null,
            success: true
        };
    } catch (error) {
        console.error(`Error fetching ${githubUrl}:`, error);
        return { stars: 0, watchers: 0, forks: 0, lastCommit: null, success: false };
    }
}

/**
 * Enriches projects array with GitHub data (stars, watchers, forks, last commit)
 * @param {Array} projects - Array of project objects
 * @returns {Promise<Array>} - Projects with GitHub data fields
 */
export async function enrichProjectsWithGitHubData(projects) {
    // Filter projects that have valid GitHub URLs
    const projectsWithGitHub = projects.filter(p => {
        return p.isReal && p.github && p.github !== '#';
    });

    if (projectsWithGitHub.length === 0) {
        console.log('No projects with valid GitHub URLs found');
        return projects;
    }

    console.log(`Fetching GitHub data for ${projectsWithGitHub.length} projects...`);

    // Fetch all repos in parallel
    const promises = projectsWithGitHub.map(async project => {
        const result = await fetchRepoData(project.github);

        return {
            ...project,
            stars: result.stars,
            watchers: result.watchers,
            forks: result.forks,
            lastCommitDate: result.lastCommit,
            githubDataSuccess: result.success
        };
    });

    const enrichedProjects = await Promise.all(promises);

    // Merge enriched data back into original projects array
    const projectMap = new Map(enrichedProjects.map(p => [p.id, p]));

    return projects.map(project => {
        return projectMap.has(project.id) ? projectMap.get(project.id) : project;
    });
}

/**
 * Gets cached project data if valid
 * @returns {object|null} - Cached data or null if expired/missing
 */
function getFromCache() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
            console.log('Using cached GitHub data');
            return data;
        }

        console.log('Cache expired');
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * Saves project data to cache
 * @param {Array} data - Projects array to cache
 */
function saveToCache(data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
        console.log('GitHub data cached successfully');
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

/**
 * Main function to get projects sorted by recent commits
 * Uses cache if available, fetches from GitHub otherwise
 * @param {Array} projects - Original projects array
 * @returns {Promise<Array>} - Sorted projects array
 */
export async function getRecentProjects(projects, limit = 6) {
    // Try to get from cache first
    const cached = getFromCache();
    if (cached) {
        return cached.slice(0, limit);
    }

    try {
        // Fetch fresh data from GitHub
        const enriched = await enrichProjectsWithGitHubData(projects);

        // Filter only real projects with successful GitHub data
        const withGitHubData = enriched.filter(p =>
            p.isReal && p.lastCommitDate && p.githubDataSuccess
        );

        // Sort by last commit date (most recent first)
        const sorted = withGitHubData.sort((a, b) => {
            return new Date(b.lastCommitDate) - new Date(a.lastCommitDate);
        });

        const topProjects = sorted.slice(0, limit);

        // Cache the results
        saveToCache(topProjects);

        return topProjects;
    } catch (error) {
        console.error('Error fetching GitHub data:', error);

        // Fallback: return featured projects that are completed or in-progress
        console.log('Using fallback: featured projects');
        return projects
            .filter(p => p.isReal && (p.status === 'completed' || p.status === 'in-progress'))
            .slice(0, limit);
    }
}

/**
 * Clears the GitHub data cache
 * Useful for testing or forcing fresh data
 */
export function clearCache() {
    try {
        localStorage.removeItem(CACHE_KEY);
        console.log('GitHub cache cleared');
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}
