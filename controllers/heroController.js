const Hero = require('../models/Hero');

// Get hero data
const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    
    if (!hero) {
      // Create default hero if none exists
      hero = new Hero({
        name: 'Your Name',
        title: 'I develop web applications, user interfaces and digital experiences',
        profileImage: '',
        backgroundImage: '',
        socialLinks: {
          github: 'https://github.com/username',
          linkedin: 'https://linkedin.com/in/username'
        }
      });
      await hero.save();
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update hero data
const updateHero = async (req, res) => {
  try {
    const { name, title, profileImage, backgroundImage, socialLinks } = req.body;
    
    let hero = await Hero.findOne();
    
    if (!hero) {
      hero = new Hero({
        name,
        title,
        profileImage,
        backgroundImage,
        socialLinks
      });
    } else {
      hero.name = name;
      hero.title = title;
      hero.profileImage = profileImage;
      hero.backgroundImage = backgroundImage;
      hero.socialLinks = socialLinks;
    }
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getHero,
  updateHero
};