# 🌍 World Clock Application

A modern, feature-rich world clock application built with React, TypeScript, and Vite. Track multiple time zones, plan meetings, and view time differences at a glance.

## ✨ Features

- **Multi-Time Zone Display**: View multiple time zones simultaneously with clear visual distinction between day and night times.
- **Interactive Calendar**: Monthly view with day selection and easy navigation.
- **Time Control**: Interactive slider with 15-minute increments and live/manual time control.
- **Floating Window Mode**: App-like experience in a dedicated window.
- **Draggable Time Zones**: Reorder time zones by dragging and dropping.
- **Optimal Meeting Times**: Visual indicators for business hours across time zones.
- **Responsive Design**: Works on desktop and mobile devices.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/world-clock.git
cd world-clock

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Building for Production

```bash
# Create production build
npm run build
# or
yarn build

# Preview production build
npm run preview
# or
yarn preview
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the project on [Vercel](https://vercel.com/)
3. Vercel will automatically detect the Vite project and configure it

### Netlify
1. Push your code to a Git repository
2. Create a new site in Netlify and link your repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 📱 Using the App

### Adding Time Zones
1. Click the "+" button at the bottom of the time zone list
2. Search for a city or select from the list
3. Click to add the time zone

### Reordering Time Zones
1. Hover over a time zone to see the drag handle (⋮⋮) on the left
2. Click and hold the drag handle
3. Drag the time zone to its new position
4. Release to drop it in place

### Using the Time Slider
- Drag the slider to change the displayed time
- Click the reset button (↻) to return to the current time
- The slider moves in 15-minute increments

### Floating Window Mode
1. Click the external link icon in the top-right corner
2. The app will open in a new, clean window
3. Position and resize the window as needed
4. All features work in the floating window

## 🛠️ Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Moment.js](https://momentjs.com/) - Parse, validate, manipulate, and display dates
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag and Drop for React

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various world clock applications
- Built with modern web technologies
- Special thanks to the open-source community for amazing libraries and tools
