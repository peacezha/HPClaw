/** Static child program for exclusive checkout-directory allocation inside the process sandbox. */
/**
 * The child receives the configured root and destination as literal argv. Existing roots retain
 * their files; only the process that creates a root writes its self-ignoring .gitignore.
 */
export declare const PREPARE_DIRECTORY = "\nimport fs from 'node:fs/promises';\nimport path from 'node:path';\nasync function main() {\n  const [root, destination] = process.argv.slice(1);\n  await fs.mkdir(path.dirname(root), { recursive: true });\n  let created = false;\n  try {\n    await fs.mkdir(root);\n    created = true;\n  } catch (error) {\n    if (error.code !== 'EEXIST' || !(await fs.stat(root)).isDirectory()) throw error;\n  }\n  if (created) await fs.writeFile(path.join(root, '.gitignore'), '*\\n', { flag: 'wx' });\n  await fs.mkdir(path.dirname(destination), { recursive: true });\n  await fs.mkdir(destination);\n}\nmain().catch(error => { console.error(error.message); process.exitCode = 1; });\n";
//# sourceMappingURL=directory.d.ts.map