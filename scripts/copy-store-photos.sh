#!/bin/bash
set -euo pipefail

ASSETS="/Users/justinasjocius/.cursor/projects/Users-justinasjocius-ukmerges-koops-website/assets"
PUBLIC="/Users/justinasjocius/ukmerges-koops-website/public"

cp -f "$ASSETS/sermuksne-9c827092-d3eb-4961-89ca-b48bf1271d90.jpg" "$PUBLIC/store-sermuksne.jpeg"
cp -f "$ASSETS/slaitai-1500x844-0b4cce63-ee0c-4e6b-ac8a-f689fbd5dc8a.jpg" "$PUBLIC/store-slaitai.jpeg"
cp -f "$ASSETS/Pivonija-ad5f20a0-13bb-469f-8ac3-faa5652a0c92.jpg" "$PUBLIC/store-pivonija.jpeg"
cp -f "$ASSETS/zemaitkemis_nauj-6c96cac6-3725-4e97-8e1d-ead57b569941.jpg" "$PUBLIC/store-zemaitkiemis.jpeg"
cp -f "$ASSETS/Atkoc_iai-79a30977-b635-479d-86c5-76b6735c49e3.jpg" "$PUBLIC/store-atkociai.jpeg"
cp -f "$ASSETS/Papartis-52cdb7ea-57a8-4658-bf5a-612d35a8661c.jpg" "$PUBLIC/store-papartis.jpeg"

ls -la "$PUBLIC"/store-{sermuksne,slaitai,pivonija,zemaitkiemis,atkociai,papartis}.jpeg
