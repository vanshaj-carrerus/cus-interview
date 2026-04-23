import { cppData } from "../practice/data/cpp-data";
import { csharpData } from "../practice/data/csharp-data";
import { dataScienceData } from "../practice/data/data-science-data";
import { databasesData } from "../practice/data/databases-data";
import { javaData } from "../practice/data/java-data";
import { javascriptData } from "../practice/data/javascript-data";
import { programmingData } from "../practice/data/programming-data";
import { pythonData } from "../practice/data/python-data";
import { puzzleData } from "../practice/data/puzzle-data";
import { scriptingData } from "../practice/data/scripting-data";
import { systemDesignData } from "../practice/data/system-design-data";
import { TopicData } from "../practice/data/types";

export const topicMap: Record<string, TopicData> = {
  [programmingData.slug]: programmingData,
  [dataScienceData.slug]: dataScienceData,
  [systemDesignData.slug]: systemDesignData,
  [databasesData.slug]: databasesData,
  [puzzleData.slug]: puzzleData,
  [scriptingData.slug]: scriptingData,
};

export function getTopicData(topic: string) {
  return topicMap[topic];
}

export const courseMap: Record<string, TopicData> = {
  [javaData.slug]: javaData,
  [javascriptData.slug]: javascriptData,
  [pythonData.slug]: pythonData,
  [cppData.slug]: cppData,
  [csharpData.slug]: csharpData,
};

export function getCourseData(course: string) {
  return courseMap[course];
}
