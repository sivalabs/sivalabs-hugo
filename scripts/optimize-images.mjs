
import sharp from "sharp";
import fg from "fast-glob";
import path from "node:path";

(async () => {
    const fullImages = await convertImages(
        "static/images",
        false
    );

    const previewImages = await convertImages(
        "static/preview-images",
        true
    );

    console.log(
        `Converted ${fullImages + previewImages} images to WEBP format.`
    );
})();

async function convertImages(destination, resize) {
    const files = await fg("static/raw-images/*.{jpg,jpeg,png}");

    await Promise.all(
        files.map(async (file) => {
            const output = path.join(
                destination,
                `${path.parse(file).name}.webp`
            );

            let pipeline = sharp(file);

            if (resize) {
                pipeline = pipeline.resize(600, 340, {
                    fit: "inside",
                    withoutEnlargement: true
                });
            }

            await pipeline
                .webp({ quality: 80 })
                .toFile(output);
        })
    );

    return files.length;
}
