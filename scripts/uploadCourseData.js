// 该文件的逻辑都是临时的
// 后续会基于后台管理页面来上传数据
// 平时的开发也无需执行该脚本 数据已经全部推上去了
// Course JSON: each statement should include englishGloss (English prompt on question screen).
// Validate: npm run validate:courses-english
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

(async function () {
  const courses = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./courses.json"))
  );
  const datasourceUrl = process.env.DATABASE_URL;

  console.log(courses, datasourceUrl);

  const prisma = new PrismaClient({
    datasourceUrl,
  });

  await prisma.statement.deleteMany();

  let orderIndex = 1;
  for (const { cId, fileName } of courses) {
    const courseDataText = fs.readFileSync(
      path.resolve(__dirname, `./courses/${fileName}.json`),
      "utf-8"
    );
    const courseData = JSON.parse(courseDataText);

    const promiseAll = courseData.map((statement, index) => {
      const { chinese, pinyin, soundmark, englishGloss } = statement;
      const result = createStatement(
        orderIndex,
        chinese,
        pinyin,
        soundmark,
        englishGloss ?? null,
        cId
      );
      orderIndex++;
      return result;
    });

    console.log(`开始上传： courseName:${fileName}`);
    await Promise.all(promiseAll);
    console.log(`courseName: ${fileName} 全部上传成功`);
  }

  async function createStatement(
    order,
    chinese,
    pinyin,
    soundmark,
    englishGloss,
    courseId
  ) {
    await prisma.statement.create({
      data: {
        order,
        chinese,
        pinyin,
        soundmark,
        englishGloss,
        courseId,
      },
    });
  }
})();
