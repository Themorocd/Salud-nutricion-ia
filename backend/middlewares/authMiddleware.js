// middlewares/authMiddleware.js
module.exports = (req, res, next) => {
  console.log('Autenticando...');
  next(); // Continúa con la ejecución
};
// Este middleware se encarga de autenticar las peticiones. Puedes agregar lógica para verificar tokens, sesiones, etc.
// En este caso, simplemente imprime un mensaje y llama a next() para continuar con la siguiente función de middleware o ruta.
