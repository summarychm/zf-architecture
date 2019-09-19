export default function({ getState, dispatch }) {
	return (next) => {
		return (action) => {
			return isPromise(action.payload)
				? action.payload
						.then((result) =>{console.log("redux-promise"); return dispatch({ ...action, payload: result })})
						.catch((err) => {
							dispatch({ ...action, payload: err, error: true });
							
							return Promise.reject(err);
						})
				: next(action);
		};
	};
}

function isPromise(obj) {
	return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
