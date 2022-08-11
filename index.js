import snoowrap from "snoowrap";
import "dotenv/config";

const unixUtcToEtc = (unixUtc) => {
  const unixEtc = unixUtc - 3600 * 4;
  return unixEtc;
};

const unixToDatetime = (unix) => {
  const milliseconds = unixUtcToEtc(unix) * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString(); //2019-12-9 10:30:15
  return humanDateFormat;
};

export async function scrapeSubreddit() {
  const r = new snoowrap({
    userAgent: process.env.USER_AGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });

  const subreddit = await r.getSubreddit("technology");
  const topPosts = await subreddit.getHot({ limit: 12 });

  let data = [];

  topPosts.forEach((post) => {
    data.push({
      text: post.title,
      url: post.url,
      image: post.thumbnail,
      created: unixToDatetime(post.created_utc),
    });
  });
  data.shift();
  return data;
}

console.log(await scrapeSubreddit());
