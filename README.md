1. generate file key
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -in private.pem -pubout -out public.pem




# logger with Ansi escape code 
	•	\x1b[30m: Black
	•	\x1b[31m: Red
	•	\x1b[32m: Green
	•	\x1b[33m: Yellow
	•	\x1b[34m: Blue
	•	\x1b[35m: Magenta
	•	\x1b[36m: Cyan
	•	\x1b[37m: White
	•	\x1b[0m: Reset to default color
    console.log('\x1b[32m%s\x1b[0m', 'This is a green success message');