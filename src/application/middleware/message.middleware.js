export const verifyMessage = (req, res, next) => {
    try {
        const userId = req.user.id;
        const isMyMessage = req.body.senderId === userId ? true : false;
        req.isMyMessage = isMyMessage;
        if (isMyMessage) {
            next();
        } else {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                status: HTTP_STATUS.UNAUTHORIZED,
                success: false,
                message: "You are not authorized to perform this action"
            });
        }
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
