const OpenAI = require('openai');
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.entrenadorIA = async (req, res) => {
  const { edad, altura, peso, sexo, objetivo, alergias, tipoDieta, tipoRespuesta } = req.body;

  if (!edad || !altura || !peso || !sexo || !objetivo) {
    return res.status(400).json({ message: 'Faltan datos del usuario para generar recomendaciones.' });
  }

  let prompt = '';
  if (tipoRespuesta === 'rutina') {
    prompt = `
Edad: ${edad}
Altura: ${altura} cm
Peso: ${peso} kg
Sexo: ${sexo}
Objetivo: ${objetivo}
Alergias: ${alergias || 'Ninguna'}
Tipo de dieta: ${tipoDieta || 'Ninguna'}

Devuélveme SOLO la respuesta en formato JSON válido, sin ningún texto antes ni después, con la siguiente estructura:

{
  "rutina": [
    {
      "dia": "Lunes",
      "ejercicios": [
        { "nombre": "", "series": "", "repeticiones": "", "descanso": "" }
      ]
    }
    // ...un objeto igual para cada día de la semana
  ]
}

No incluyas explicaciones, títulos, ni comentarios. Solo quiero el JSON limpio, bien formado y completo, con todos los días de la semana para la rutina, cada uno con sus ejercicios principales.
`.trim();
  } else if (tipoRespuesta === 'dieta') {
    prompt = `
Edad: ${edad}
Altura: ${altura} cm
Peso: ${peso} kg
Sexo: ${sexo}
Objetivo: ${objetivo}
Alergias: ${alergias || 'Ninguna'}
Tipo de dieta: ${tipoDieta || 'Ninguna'}

Devuélveme SOLO la respuesta en formato JSON válido, sin ningún texto antes ni después, con la siguiente estructura:

{
  "dieta": [
    {
      "dia": "Lunes",
      "comidas": [
        { "nombre": "", "alimentos": "", "cantidad": "" }
      ]
    }
    // ...un objeto igual para cada día de la semana
  ]
}

No incluyas explicaciones, títulos, ni comentarios. Solo quiero el JSON limpio, bien formado y completo, con todos los días de la semana (Lunes a Domingo) para la dieta, cada uno con solo desayuno, almuerzo y cena.
`.trim();
  } else {
    return res.status(400).json({ message: 'tipoRespuesta debe ser "rutina" o "dieta".' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'Eres un entrenador personal y nutricionista experto. Proporciona respuestas claras y estructuradas de la forma correcta.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const recomendaciones = response.choices[0].message.content.trim();
    console.log('Respuesta IA:', recomendaciones);

    // Intenta parsear el JSON directamente
    try {
      const json = JSON.parse(recomendaciones);
      return res.status(200).json({ recomendaciones: json });
    } catch (e) {
      // Si falla, intenta extraer el JSON con una expresión regular
      const match = recomendaciones.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const json = JSON.parse(match[0]);
          return res.status(200).json({ recomendaciones: json });
        } catch (e2) {}
      }
      // Si no se puede parsear, devuelve el texto original
      return res.status(200).json({ recomendaciones });
    }
  } catch (error) {
    console.error(
      'Error al generar recomendaciones:',
      error.response?.data || error.message
    );
    res.status(500).json({ message: 'Error al generar recomendaciones.' });
  }
};
