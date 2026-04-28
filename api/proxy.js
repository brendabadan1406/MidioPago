export default async function handler(req, res) {

  const BIN_ID = "69f0cf0636566621a8004ce3";
  const API_KEY = process.env.JSONBIN_API_KEY;

  if (req.method === "GET") {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });

    const data = await response.json();
    return res.status(200).json(data.record);
  }

  if (req.method === "POST") {
    const { action, xpGain, user } = req.body;

    const current = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });

    const json = await current.json();
    const data = json.record;

    data.logs.unshift({
      user,
      action,
      xp: xpGain,
      date: new Date().toLocaleString()
    });

    data.users[user] = (data.users[user] || 0) + xpGain;

    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(data)
    });

    return res.status(200).json({ ok: true });
  }

}

// update
