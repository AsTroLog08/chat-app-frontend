
export const errorMiddleware = store => next => action => {
  if (action.type.endsWith("/rejected") && action.payload) {
    const error = action.payload;

    let message = "unknown";

    if (typeof error === "string") {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error) {
      message = error.error;
    } else if (error?.status === 401) {
      message = "unauthorized";
    } else if (error?.status === 403) {
      message = "forbidden";
    } else if (error?.status === 404) {
      message = "notFound";
    } else if (error?.status === 500) {
      message ="common.toast.serverError";
    } else if (error?.data?.message) {
      message = error.data.message;
    }

    console.warn("API error:", error);
    console.warn("API message:", message);
  //  toast.error(message);
  }

  return next(action);
};
