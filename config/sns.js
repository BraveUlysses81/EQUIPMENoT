sns.createPlatformEndpoint({
    Token: 'arn:aws:sns:us-east-1:839517242093:CaldoGallego:a7c2fa00-ffec-4eaa-a5db-dea209bbd82e',
    PlatformApplicationArn: 'arn:aws:sns:us-east-1:839517242093:CaldoGallego',
}, function(err, data) {
    if (err) {
        console.log(err.stack);
        return;
    }

    console.log("Here's the data object " + data);

    var endpointArn = data.EndpointArn;

    console.log("here's the endpointArn " + endpointArn);

    var payload = {
        default: 'Hello World',
        GCM: {
            aps: {
                alert: 'hello punk',
                sound: 'default',
                badge: 1
            }
        }
    };

    // first have to stringify the inner GCM object...
    payload.GCM = JSON.stringify(payload.GCM);
    // then have to stringify the entire message payload
    payload = JSON.stringify(payload);

    console.log('sending push');
    sns.publish({
        Message: payload,
        MessageStructure: 'json',
        TargetArn: endpointArn
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }

        console.log('push sent');
        console.log(data);
    });
});



ses.sendEmail({
    Destination: {
        ToAddresses: [
            "willie.witten@gmail.com"
        ]
    },
    Message: {
        Body: {
            Html: {
                Charset: "UTF-8",
                Data: "This message body contains HTML formatting. It can, for example, contain links like this one: " +
                "<a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
            }
        },
        Subject: {
            Charset: "UTF-8",
            Data: "Greetings from SES email hell"
        },

    },
    Source: "willie.witten@gmail.com"
}, function(err, data){
    if (err) {
        console.log(err.stack);
        return;
    }
    else {
        console.log('push sent');
        console.log(data);
    }
});

sns.publish({
    Message: '!!',
    MessageStructure: 'string',
    Subject: 'Greetings from Git Hell',
    TargetArn: 'arn:aws:sns:us-east-1:839517242093:CaldoGallego'
}, function(err, data) {
    if (err) {
        console.log(err.stack);
        return;
    }
    else {
        console.log('push sent');
        console.log(data);
    }
});

s3.listObjectsV2({
    Bucket: 'theredbaronfliesagain'
    //EncodingType: 'url'
}, function (err, data){
    if (err){
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
});

s3.getObject({
    Bucket: 'theredbaronfliesagain',
    Key: 'BillWalton.JPG'
}, function (err, data){
    if (err){
        console.log(err, err.stack);
    }
    else {
        console.log(data);
    }
});

let url = s3.getSignedUrl('putObject', {
    Bucket: 'equipmenot',
    Key: 'person11/profile',
    ACL: 'authenticated-read',
    // This must match with your ajax contentType parameter
    ContentType: 'binary/octet-stream'
    /* then add all the rest of your parameters to AWS puttObect here */
});

console.log(file.name);

console.log(url);
requ({
    method: "PUT",
    contentType: 'binary/octet-stream',
    url: url,
    body: fs.createReadStream(file)
}, function(err, res, body){
    if (err) {
        return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
});