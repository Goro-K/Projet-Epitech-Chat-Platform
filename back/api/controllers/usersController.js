import User from '../../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.TOKEN, { expiresIn: '3d' })
}

const regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/; //regex for email address

export async function signup (req, res) {
    const user = req.body;

    if (!user.username || !user.password) {
        res.status(400).send('Missing username or password');
        return;
    }
    if (!regexMail.test(user.email)) {
        res.status(400).send('Invalid email address');
        return;
    }
    if (user.password !== user.password_confirm) {
        res.status(400).send('Passwords do not match');
        return;
    }

    let existingUser;

    existingUser = await User.findOne({ email: user.email });

    if(existingUser) {
      return res.status(400).json({message : 'Utilisateur déjà existant'})
    }
    try {
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = new User(user);
        const token = createToken(newUser._id)
        res.status(201).json({userId: newUser._id, user: newUser.username, email: newUser.email, token: token});
        await newUser.save();
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
}

export async function login(req, res) {
    const user = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: user.email });
    } catch (error) {
      return res.status(400).json({ message: "User introuvable" });
    }

    if (!existingUser) {
      return res.status(400).json({ message: "User introuvable" });
    }
    
    existingUser = existingUser.toObject();
    try {
        const validPassword = await bcrypt.compare(user.password, existingUser.password);
        if (validPassword) {
          const token = createToken(existingUser._id)
            // res.cookie("authToken", token, { 
            //   httpOnly: true, 
            //   secure: false, // set to true if https
            //   sameSite: "strict" 
            // });
            res.status(200).json({ userId: existingUser._id, username: existingUser.username, email: existingUser.email, token: token});
        } else {
          res.status(401).json({ message: "Incorrect username/password pair" });
        }
      } catch (error) {
        res
          .status(401)
          .json({ message: `Incorrect username/password pair ${error.message}` });
      }
}

export async function getAllUser(req, res) {
  try {
      const users = await User.find();
      res.status(200).json(users);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export async function getUser(req, res) {
  const { id } = req.params;
  try {
      const user = await User.findById(id);
      res.status(200).json(user);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export async function changePassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const validPassword = await bcrypt.compare(newPassword, user.password);
      if (validPassword) {
        return res.status(401).json({ message: 'password inchangé' });
      }
      user.password = await bcrypt.hash(newPassword, 10); 
      await user.save();
      res.status(200).json({ message: 'Password updated' });
  }
  catch (error) {
      res.status(404).json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la suppression du compte' });
  }
}