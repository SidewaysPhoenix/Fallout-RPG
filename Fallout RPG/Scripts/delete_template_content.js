async function delete_template_content(tp) {
    const file = app.workspace.getActiveFile();
    if (!file) return;

    // Read the file content
    const content = await app.vault.read(file);

    // Replace everything between TEMPLATE_START and TEMPLATE_END with empty space
    const updatedContent = content.replace(/<!-- TEMPLATE_START -->[\s\S]*?<!-- TEMPLATE_END -->/, 
                                           '<!-- TEMPLATE_START -->\n\n<!-- TEMPLATE_END -->');

    // Write the updated content back to the file
    await app.vault.modify(file, updatedContent);
}

module.exports = delete_template_content;
