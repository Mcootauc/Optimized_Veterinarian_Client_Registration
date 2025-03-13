// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { supabase } = require('./services/supabaseClient');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Redirect HTTP to HTTPS only in production
// app.use((req, res, next) => {
//     // Skip redirect for local development
//     if (
//         process.env.NODE_ENV === 'production' &&
//         req.headers['x-forwarded-proto'] !== 'https'
//     ) {
//         return res.redirect('https://' + req.headers.host + req.url);
//     }
//     next();
// });

// app.get('/', (req, res) => {
//     res.send('Backend is running with HTTPS and Supabase integration!');
// });

// app.post('/submit', async (req, res) => {
//     const {
//         timestamp,
//         ownerName,
//         homeAddress,
//         city,
//         state,
//         zipCode,
//         cellPhone,
//         email,
//         petName,
//         species,
//         breed,
//         age,
//         sex,
//         spayedOrNeutered,
//         color,
//         microchip,
//         initials,
//     } = req.body;

//     try {
//         // Insert data into Supabase 'clients' table
//         const { data, error } = await supabase.from('clients').insert([
//             {
//                 timestamp,
//                 owner_name: ownerName,
//                 home_address: homeAddress,
//                 city,
//                 state,
//                 zip_code: zipCode,
//                 cell_phone: cellPhone,
//                 email,
//                 pet_name: petName,
//                 species,
//                 breed,
//                 age,
//                 sex,
//                 spayed_or_neutered: spayedOrNeutered,
//                 color,
//                 microchip,
//                 initials,
//             },
//         ]);

//         if (error) {
//             console.error('Error inserting data:', error);
//             return res.status(500).json({ error: error.message });
//         }

//         res.status(200).json({
//             message: 'Successfully submitted! Thank you!',
//             data,
//         });
//     } catch (err) {
//         console.error('Server error:', err);
//         res.status(500).json({ error: 'An unexpected error occurred' });
//     }
// });

// // Use the dynamic port assigned by Elastic Beanstalk
// const PORT = process.env.PORT || 1337;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
