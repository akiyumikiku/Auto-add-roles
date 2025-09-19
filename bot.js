const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const CHANNEL_ID = "YOUR_VERIFY_CHANNEL_ID"; // 👈 thay bằng ID kênh verify

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  // đọc trạng thái đã gửi chưa
  let sentData = JSON.parse(fs.readFileSync("sent.json", "utf8"));

  if (!sentData.sent) {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle("🔑 Roblox Verification")
          .setDescription(
            "Ấn nút dưới đây để xác minh Roblox account của bạn thông qua Rover.\n\n" +
              "✅ Sau khi verify xong, bot sẽ **tự động cập nhật roles** dựa trên Roblox profile (badges, group rank...)."
          )
          .setColor("#2f3136");

        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Verify with Rover")
            .setStyle(ButtonStyle.Link)
            .setURL("https://verify.eryn.io/")
        );

        await channel.send({ embeds: [embed], components: [button] });
        console.log("✅ Embed verify đã gửi vào kênh!");

        // cập nhật file để không gửi lại
        sentData.sent = true;
        fs.writeFileSync("sent.json", JSON.stringify(sentData, null, 2));
      }
    } catch (err) {
      console.error("❌ Lỗi khi gửi embed:", err);
    }
  } else {
    console.log("⚠️ Embed verify đã được gửi trước đó, bot sẽ không gửi lại.");
  }
});

client.login(process.env.TOKEN);
