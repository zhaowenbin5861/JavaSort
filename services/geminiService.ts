import { GoogleGenAI, Type } from "@google/genai";
import { SortingAlgorithm, AlgoInfo } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Cache to prevent redundant API calls during a session
const cache: Record<string, AlgoInfo> = {};

export const fetchAlgorithmDetails = async (algorithm: SortingAlgorithm): Promise<AlgoInfo> => {
  if (cache[algorithm]) {
    return cache[algorithm];
  }

  // Fallback if no API key is present
  if (!apiKey) {
    return {
      name: algorithm,
      description: "未检测到 API 密钥。请在环境变量中配置 API_KEY 以获取 AI 生成的动态详解。",
      timeComplexity: "未知",
      spaceComplexity: "未知",
      javaCode: "// 请配置您的 API Key 以获取 Java 代码。"
    };
  }

  try {
    const prompt = `
      请为算法 "${algorithm}" 提供详细的分析和标准的 Java 实现。
      请以简体中文回复。
      回复格式必须是结构化的 JSON。
      Java 代码应该是干净、注释良好且符合标准的。
      描述部分应简要解释其概念上的工作原理。
      时间和空间复杂度应使用大 O 符号表示。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "算法名称 (中文)" },
            description: { type: Type.STRING, description: "算法原理描述 (中文)" },
            timeComplexity: { type: Type.STRING, description: "时间复杂度" },
            spaceComplexity: { type: Type.STRING, description: "空间复杂度" },
            javaCode: { type: Type.STRING, description: "完整的 Java 实现代码" },
          },
          required: ["name", "description", "timeComplexity", "spaceComplexity", "javaCode"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as AlgoInfo;
    
    // Cache the result
    cache[algorithm] = data;
    
    return data;
  } catch (error) {
    console.error("Error fetching algorithm details:", error);
    return {
      name: algorithm,
      description: "获取 AI 详情失败，请重试。",
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
      javaCode: "// 获取代码时发生错误。"
    };
  }
};