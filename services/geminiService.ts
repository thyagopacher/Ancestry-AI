
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult } from "../types";

export const generateFamilyTree = async (
  userName: string,
  fatherName: string,
  motherName: string
): Promise<SearchResult> => {
  // Criar nova instância para garantir o uso da chave mais recente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    Você é um genealogista profissional. Sua tarefa é construir uma árvore genealógica o mais completa possível para:
    - Pessoa principal: ${userName}
    - Pai: ${fatherName}
    - Mãe: ${motherName}

    INSTRUÇÕES CRÍTICAS:
    1. USE O GOOGLE SEARCH para tentar localizar os avós paternos e maternos de ${userName} com base nos nomes completos dos pais.
    2. Se os nomes forem comuns e não houver um registro histórico óbvio, use a lógica de genealogia (sobrenomes) e registros públicos para sugerir nomes de avós ou bisavós plausíveis da região.
    3. Se não encontrar NENHUMA informação externa, construa a árvore básica com os dados fornecidos e marque os ancestrais desconhecidos como "Antepassado de [Nome do Filho]".
    4. A estrutura JSON deve ser: um nó principal (${userName}) com uma lista "children" contendo o Pai e a Mãe. Cada um deles deve ter seus próprios "children" (os avós).
    5. Vá até 3 ou 4 gerações se possível.
    
    FORMATAÇÃO:
    Retorne apenas o objeto JSON no formato solicitado. Não adicione markdown ou comentários.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tree: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                birthYear: { type: Type.STRING },
                children: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      birthYear: { type: Type.STRING },
                      children: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            role: { type: Type.STRING },
                            children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } } }
                          }
                        }
                      }
                    }
                  }
                }
              },
              required: ["name"]
            }
          },
          required: ["tree"]
        }
      }
    });

    // Sanitização básica da resposta caso venha com markdown
    let jsonStr = response.text || "";
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsed = JSON.parse(jsonStr);
    
    // Extração robusta de fontes
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Registro Público",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];

    return {
      tree: parsed.tree,
      sources
    };
  } catch (error) {
    console.error("Erro detalhado na Gemini API:", error);
    throw new Error("Não foi possível processar a árvore. Verifique se os nomes estão corretos ou tente novamente em instantes.");
  }
};
