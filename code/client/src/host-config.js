const host = !process.env.NODE_ENV || process.env.NODE_ENV ==='development'
? 'http://localhost:5000' : '';

export default host;