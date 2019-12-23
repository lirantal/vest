const jsnpm = require('jsnpm');

const PACKAGE_NAME = 'vest';

const unpublish = async () => {
    const versions = await jsnpm.versions(PACKAGE_NAME);
    const nextOnly = versions.filter((v) => v.includes('next'));

    const one = async (i = 0) => {
        const current = nextOnly[i];

        if (!current) {
            return;
        }

        console.log(`Unpublishing: ${PACKAGE_NAME}@${current}`);

        try {
            await jsnpm.unpublish(PACKAGE_NAME, current);
        } catch(e) {
            console.log(`Unable to unpublish: ${current}`, e);
        }

        one(++i);
    }

    one();
}

unpublish();

