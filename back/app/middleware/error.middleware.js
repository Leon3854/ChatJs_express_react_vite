export const notFound = (err, req, res, next) => {
	// console.log(err)
	const error = new Error(`Not found - ${req.originalUrl}`)
	error.status = 404
	next(error)
}
// // Обработчик ошибок
// export const errorHandler = (err, req, res, next) => {
// 	const statusCode = err.status || 500; // Если статус не установлен, используем 500
// 	res.status(statusCode).json({
// 			message: err.message
// 	});
// };

export const errorHandler = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode
	res.status(statusCode)
	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack
	})
}

// Если NODE_ENV равен 'production', то в ответе на ошибку не
// будет информации о стеке вызовов (для безопасности).
// Если NODE_ENV не равен 'production', то в ответе будет
// включен стек вызовов, что может помочь в отладке.
// использование stack позволяет контролировать, какая
// информация будет доступна в зависимости от окружения, в
// котором работает приложение.
