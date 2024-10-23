require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js");
const axios = require("axios");

const client = new Client({
  disableEveryone: true,
});

const owner_id = "637281836048842757";

client.on("ready", async () => {
  console.clear();
  console.log(`${client.user.tag} is online!`);

  await client.user.setStatus("Streaming");
  client.user.setActivity(`Ping Me to Respond`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/#",
  });
});

client.on("guildCreate", (guild) => {
  const thankYouEmbed = new MessageEmbed()
    .setColor("#00FF00")
    .setTitle("Thank You for Adding Me!")
    .setDescription(
      `Hello! I'm Akane, here to help you with your questions and have fun in ***${guild.name}***. Ping me or use '!' prefix to interact with me. 🤖`
    )
    .setThumbnail(client.user.displayAvatarURL());

  const defaultChannel = guild.channels.cache.find(
    (channel) =>
      channel.type === "text" &&
      channel.permissionsFor(guild.me).has("SEND_MESSAGES")
  );

  if (defaultChannel) {
    defaultChannel.send(thankYouEmbed).catch(console.error);
  } else {
    console.error(
      "Unable to send thank you message in the new server. Bot does not have permission to send messages in any text channel."
    );
  }
});

client.on("message", async (message) => {
  if (!message.guild || message.author.bot) return;

  const isPrefixed = message.content.startsWith("!");
  const mentionsBot = message.mentions.users.has(client.user.id);

  if (!isPrefixed && !mentionsBot) return;

  const questionKeywords = [
    "developer",
    "creator",
    "made",
    "build",
    "developed",
  ];
  const lowercaseContent = message.content.toLowerCase();

  for (const keyword of questionKeywords) {
    if (lowercaseContent.includes(keyword)) {
      const owner = await client.users.fetch(owner_id).catch(() => null);
      if (owner) {
        const embed = new MessageEmbed()
          .setColor("#00FF00")
          .setDescription(`My developer is ${owner.tag}`);
        return message.channel.send(embed);
      }
    }
  }

  try {
    const res = await axios.get(
      `http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=${encodeURIComponent(
        message.content
      )}`
    );
    message.channel.send(res.data.cnt);
  } catch (error) {
    errorEmbed("Bot error, please try again!", message);
  }
});

async function errorEmbed(text, message) {
  const newEmbed = new MessageEmbed()
    .setColor("#FF7676")
    .setDescription(`**❌ | ${text} **`);
  return message.channel.send(newEmbed);
}

client.login(process.env.TOKEN);
