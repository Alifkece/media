export default async function handler(req, res) {
  try {
    // Pastikan method POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed, gunakan POST" });
    }

    const { filename, content } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ error: "filename dan content wajib diisi" });
    }

    // Repo GitHub kamu
    const repo = "Alifkece/media";
    const branch = "main";

    // Upload ke GitHub
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filename}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Upload file via Web",
          content,
          branch,
        }),
      }
    );

    const json = await response.json();

    // Return RAW URL
    if (response.ok) {
      return res.status(200).json({
        status: "ok",
        raw: `https://raw.githubusercontent.com/${repo}/${branch}/${filename}`,
        github: json,
      });
    } else {
      return res.status(response.status).json({ error: json });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
