// 远程请求数据
const fetch = require("node-fetch");
async function fetchEolinker() {
  const url =
    "https://space-ioyyco.w.eolink.com/api/apiManagementPro/Export/export";
  const data = {
    spaceKey: "space-ioyyco", // 用户提供
    projectHashKey: "ZPMCWQpfb56fe8395b59030f901f6d6660a8fb626d7e74e", // 用户提供
    format: "eolinkerProjectJson",
  };
  const cookie = [
    "gr_user_id=144dfea8-eea8-4507-8bef-91b5b91130d8",
    "_ga=GA1.2.2089909785.1638685244",
    "userToken=%242y%2410%24WWjZHy.Noqx4%2Fa%2Fu5tvgAOgjJGI01f8AWtLjwz5vR7ErRvxAuY12C",
    "verifyCode=78ee4772b6d69ae061ca68ba18a01e8b",
    "_gid=GA1.2.1365047718.1639842472",
    "_gat_gtag_UA_213727973_1=1",
    "gr_session_id_ab098937878b37f7=b5017a76-d4d1-401d-8756-e8e746ef32da",
    "Hm_lvt_25017277e350f278bef061bc6c528989=1637979734,1638685244,1639407683,1639842473",
    "Hm_lpvt_25017277e350f278bef061bc6c528989=1639842473",
    "gr_session_id_ab098937878b37f7_b5017a76-d4d1-401d-8756-e8e746ef32da=true",
  ].join("; ");

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      cookie,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.57",
    },
  });
  return await response.json();
}
fetchEolinker().then(console.log).catch(console.log);

module.exports = fetchEolinker;
