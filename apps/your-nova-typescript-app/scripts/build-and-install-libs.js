const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const wandelbotsJsPath = path.resolve(__dirname, '../../wandelbots-js');
const wandelbotsJsReactComponentsPath = path.resolve(__dirname, '../../wandelbots-js-react-components');

// Step 1: Increase the version number for wandelbots-js
const wandelbotsJsPackageJsonPath = path.join(wandelbotsJsPath, 'package.json');
const wandelbotsJsPackageJson = require(wandelbotsJsPackageJsonPath);
const versionParts = wandelbotsJsPackageJson.version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1; // Increment patch version
wandelbotsJsPackageJson.version = versionParts.join('.');
fs.writeFileSync(wandelbotsJsPackageJsonPath, JSON.stringify(wandelbotsJsPackageJson, null, 2));
console.log(`Updated version of ${wandelbotsJsPackageJson.name} to ${wandelbotsJsPackageJson.version}`);

// Step 2: Build wandelbots-js with development settings
execSync('npm run build', { cwd: wandelbotsJsPath, stdio: 'inherit' });

// Step 3: Pack wandelbots-js
execSync('npm pack', { cwd: wandelbotsJsPath, stdio: 'inherit' });

// Verify the tarball was created
const wandelbotsJsTarballName = `wandelbots-${wandelbotsJsPackageJson.name.split('/').pop()}-${wandelbotsJsPackageJson.version}.tgz`;
const wandelbotsJsTarballPath = path.join(wandelbotsJsPath, wandelbotsJsTarballName);
if (fs.existsSync(wandelbotsJsTarballPath)) {
  console.log(`Tarball created at ${wandelbotsJsTarballPath}`);
} else {
  console.error(`Failed to create tarball at ${wandelbotsJsTarballPath}`);
}

// Step 4: Install the packed wandelbots-js into wandelbots-js-react-components
console.log(`Installing ${wandelbotsJsTarballName} in @wandelbots/wandelbots-js-react-components...`);
execSync(`npm install ${wandelbotsJsTarballPath}`, { cwd: wandelbotsJsReactComponentsPath, stdio: 'inherit' });

// Step 5: Increase the version number for wandelbots-js-react-components
const wandelbotsJsReactComponentsPackageJsonPath = path.join(wandelbotsJsReactComponentsPath, 'package.json');
const wandelbotsJsReactComponentsPackageJson = require(wandelbotsJsReactComponentsPackageJsonPath);
const reactComponentsVersionParts = wandelbotsJsReactComponentsPackageJson.version.split('.');
reactComponentsVersionParts[2] = parseInt(reactComponentsVersionParts[2], 10) + 1; // Increment patch version
wandelbotsJsReactComponentsPackageJson.version = reactComponentsVersionParts.join('.');
fs.writeFileSync(wandelbotsJsReactComponentsPackageJsonPath, JSON.stringify(wandelbotsJsReactComponentsPackageJson, null, 2));
console.log(`Updated version of ${wandelbotsJsReactComponentsPackageJson.name} to ${wandelbotsJsReactComponentsPackageJson.version}`);

// Step 6: Build wandelbots-js-react-components with development settings
execSync('npm run build', { cwd: wandelbotsJsReactComponentsPath, stdio: 'inherit' });

// Step 7: Pack wandelbots-js-react-components
execSync('npm pack', { cwd: wandelbotsJsReactComponentsPath, stdio: 'inherit' });

// Verify the tarball was created
const wandelbotsJsReactComponentsTarballName = `wandelbots-${wandelbotsJsReactComponentsPackageJson.name.split('/').pop()}-${wandelbotsJsReactComponentsPackageJson.version}.tgz`;
const wandelbotsJsReactComponentsTarballPath = path.join(wandelbotsJsReactComponentsPath, wandelbotsJsReactComponentsTarballName);
if (fs.existsSync(wandelbotsJsReactComponentsTarballPath)) {
  console.log(`Tarball created at ${wandelbotsJsReactComponentsTarballPath}`);
} else {
  console.error(`Failed to create tarball at ${wandelbotsJsReactComponentsTarballPath}`);
}

// Step 8: Uninstall existing packages and update package.json in the root project
const rootPackageJsonPath = path.resolve(__dirname, '../package.json');
const rootPackageJson = require(rootPackageJsonPath);
const wandelbotsJsPackageName = wandelbotsJsPackageJson.name;
const wandelbotsJsReactComponentsPackageName = wandelbotsJsReactComponentsPackageJson.name;

// Uninstall the existing packages if they exist
try {
  execSync(`npm uninstall ${wandelbotsJsPackageName} ${wandelbotsJsReactComponentsPackageName}`, { stdio: 'inherit' });
  console.log(`Uninstalled ${wandelbotsJsPackageName} and ${wandelbotsJsReactComponentsPackageName} from the current project`);
} catch (error) {
  console.warn(`Packages ${wandelbotsJsPackageName} and/or ${wandelbotsJsReactComponentsPackageName} are not installed, skipping uninstall`);
}

// Update package.json to point to the new tarballs
rootPackageJson.dependencies[wandelbotsJsPackageName] = `file:${wandelbotsJsTarballPath}`;
rootPackageJson.dependencies[wandelbotsJsReactComponentsPackageName] = `file:${wandelbotsJsReactComponentsTarballPath}`;
fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2));
console.log(`Updated package.json to point to ${wandelbotsJsTarballPath} and ${wandelbotsJsReactComponentsTarballPath}`);

// Step 9: Install the new tarballs in the root project
if (fs.existsSync(wandelbotsJsTarballPath) && fs.existsSync(wandelbotsJsReactComponentsTarballPath)) {
  try {
    execSync(`npm install ${wandelbotsJsTarballPath} ${wandelbotsJsReactComponentsTarballPath}`, { stdio: 'inherit' });
    console.log(`Installed ${wandelbotsJsTarballName} and ${wandelbotsJsReactComponentsTarballName} in the current project`);
  } catch (error) {
    console.error(`Failed to install ${wandelbotsJsTarballName} and/or ${wandelbotsJsReactComponentsTarballName}: ${error.message}`);
  }
} else {
  console.error(`Tarballs not found at ${wandelbotsJsTarballPath} and/or ${wandelbotsJsReactComponentsTarballPath}, skipping installation`);
}

// Step 10: install dependencies in the root project
const projectRoot = path.resolve(__dirname, '..');
console.log('Reinstalling dependencies...');
execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });

console.log('Installation complete.');