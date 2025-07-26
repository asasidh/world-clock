# World Clock Application

A modern, feature-rich world clock application built with React, TypeScript, and Vite. Track multiple time zones, plan meetings, and view time differences at a glance.

## 🌟 Features

### 🕒 Multi-Time Zone Display
- View multiple time zones simultaneously
- Clear visual distinction between day and night times
- 12/24 hour format support
- Time zone abbreviation and UTC offset display

### 📅 Interactive Calendar
- Monthly calendar view with day selection
- Current day highlighting
- Easy month navigation
- Visual indication of selected date

### 🎚️ Time Control
- Interactive time slider with 15-minute increments
- Live time updates with manual override
- Reset to current time with one click
- Floating window mode for always-on-top use

### 🎨 Intuitive UI
- Clean, modern interface with dark theme
- Responsive design works on all screen sizes
- Draggable time zone reordering
- Visual indicators for optimal meeting times

### 🚀 Productivity Features
- Floating window mode (app-like experience)
- Add/remove time zones easily
- Automatic detection of current location time
- Time zone search with autocomplete

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/world-clock.git
   cd world-clock
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running Locally

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Create an optimized production build:
```bash
npm run build
# or
yarn build
```

## 🛠️ Deployment

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the project on [Vercel](https://vercel.com/)
3. Vercel will automatically detect the Vite project and configure it

### Netlify
1. Push your code to a Git repository
2. Create a new site in Netlify and link your repository
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`

### Static Hosting
1. Run `npm run build`
2. Deploy the contents of the `dist` folder to your static hosting provider

## 📱 Using the App

### Adding Time Zones
1. Click the "+" button at the bottom of the time zone list
2. Search for a city or select from the list
3. Click on the desired time zone to add it

### Reordering Time Zones
1. Hover over a time zone to see the drag handle (⋮⋮) on the left
2. Click and hold the drag handle
3. Drag the time zone to its new position
4. Release to drop it in place

### Using the Time Slider
- Drag the slider to change the displayed time
- Use the reset button (↻) to return to the current time
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
