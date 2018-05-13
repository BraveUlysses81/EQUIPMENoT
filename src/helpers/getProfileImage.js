const config = require('../../config/config')

function getProfileImage (user) {
    if (user && user.picture_url) {
        const urlParams = {
            Bucket: `equipmenot`,
            Key: `${user.picture_url}`,
            /* set a fixed type, or calculate your mime type from the file extension */
            ResponseContentType: `image/jpeg`
            /* and all the rest of your parameters to AWS getObject here */
        };

        return config.s3.getSignedUrl('getObject', urlParams);

    } else {
        return "";
    }
};

export default getProfileImage;