rm index.zip 
cd lambda 
zip -r ../index.zip *
cd .. 
aws lambda update-function-code --function-name hackathonBot2 --zip-file fileb://index.zip --region us-east-1 --profile development
