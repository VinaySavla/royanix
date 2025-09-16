import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: {
    type: String, // Base64 compressed image data (primary image)
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty images
        // Check if it's a valid base64 string and size is reasonable
        try {
          const base64Data = v.replace(/^data:image\/[a-z]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          return buffer.length <= 250 * 1024; // Max 250KB
        } catch (e) {
          return false;
        }
      },
      message: 'Primary image must be a valid base64 string and under 250KB'
    }
  },
  secondaryImage: {
    type: String, // Base64 compressed image data (secondary image)
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty images
        // Check if it's a valid base64 string and size is reasonable
        try {
          const base64Data = v.replace(/^data:image\/[a-z]+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          return buffer.length <= 250 * 1024; // Max 250KB
        } catch (e) {
          return false;
        }
      },
      message: 'Secondary image must be a valid base64 string and under 250KB'
    }
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  sizeVariants: [{
    size: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    }
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
