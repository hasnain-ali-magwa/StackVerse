import os
import json
import logging
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
from webhook import send_to_discord

# =========================================
# LOAD ENV
# =========================================
load_dotenv()
from config import Config
app = Flask(__name__)
app.config.from_object(Config)
# =========================================
# CONFIG
# =========================================
BASE_DATA_PATH = os.path.join(
    app.root_path,
    "static",
    "data"
)

PER_PAGE = 50


# =========================================
# LOGGING
# =========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


# =========================================
# JSON LOADER (CACHED)
# =========================================
def load_json(filename, folder=""):
    try:
        file_path = os.path.join(
            BASE_DATA_PATH,
            folder,
            filename
        )

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

            return data

    except FileNotFoundError:
        logging.error(f"{filename} not found")

    except json.JSONDecodeError:
        logging.error(
            f"Invalid JSON format in {filename}"
        )

    except Exception as e:
        logging.error(str(e))

    # Return proper fallback types
    if filename.endswith(".json") and folder == "tools":
        return []

    return {}

# =========================================
# VALID FIELD CHECK
# =========================================
def is_valid_field(field_id):
    fields_data = load_json("fields.json")

    valid_fields = [
        field["id"]
        for field in fields_data.get("fields", [])
    ]

    return field_id in valid_fields


# =========================================
# HOME PAGE
# =========================================
@app.route("/")
def home():
    fields_data = load_json("fields.json")

    return render_template(
        "index.html",
        fields=fields_data.get("fields", [])
    )


# =========================================
# FIELD DATA API
# =========================================
@app.route("/api/field/<field_id>")
def get_field_data(field_id):

    if not is_valid_field(field_id):
        return jsonify({
            "success": False,
            "message": "Invalid field"
        }), 404

    try:
        subfields_data = load_json(
            "subfields.json"
        )

        categories_data = load_json(
            "categories.json"
        )

        tools_data = load_json(
            f"{field_id}.json",
            folder="tools"
        )

        subfields = subfields_data.get(
            field_id,
            []
        )

        tools_lookup = {}

        for tool in tools_data:
            key = (
                tool.get("subfield"),
                tool.get("category")
            )

            if key not in tools_lookup:
                tools_lookup[key] = []

            tools_lookup[key].append(tool)

        final_result = []

        for subfield in subfields:
            subfield_id = subfield["id"]

            category_list = categories_data.get(
                subfield_id,
                []
            )

            final_categories = []

            for category in category_list:
                category_id = category["id"]

                matched_tools = tools_lookup.get(
                    (
                        subfield_id,
                        category_id
                    ),
                    []
                )

                final_categories.append({
                    "id": category_id,
                    "name": category["name"],
                    "tools": matched_tools
                })

            final_result.append({
                "id": subfield_id,
                "name": subfield["name"],
                "categories": final_categories
            })

        return jsonify({
            "success": True,
            "field": field_id,
            "total_subfields": len(final_result),
            "data": final_result
        })

    except Exception as e:
        logging.error(str(e))

        return jsonify({
            "success": False,
            "message": "Failed to load field data"
        }), 500


# =========================================
# GET TOOLS API
# =========================================
@app.route("/api/tools/<field_id>")
def get_tools(field_id):

    if not is_valid_field(field_id):
        return jsonify({
            "success": False,
            "message": "Invalid field"
        }), 404

    try:
        page = request.args.get("page", 1)
        search = request.args.get("search", "").lower()

        try:
            page = int(page)
        except:
            page = 1

        if page < 1:
            page = 1

        tools_data = load_json(
            f"{field_id}.json",
            folder="tools"
        )

        if search:
            tools_data = [
                tool for tool in tools_data
                if search in tool.get(
                    "name",
                    ""
                ).lower()
            ]

        total_tools = len(tools_data)

        start = (page - 1) * PER_PAGE
        end = start + PER_PAGE

        paginated_tools = tools_data[start:end]

        return jsonify({
            "success": True,
            "field": field_id,
            "page": page,
            "per_page": PER_PAGE,
            "total_tools": total_tools,
            "tools": paginated_tools
        })

    except Exception as e:
        logging.error(str(e))

        return jsonify({
            "success": False,
            "message": "Failed to fetch tools"
        }), 500


# =========================================
# GLOBAL SEARCH
# =========================================
@app.route("/api/search")
def global_search():
    query = request.args.get(
        "q",
        ""
    ).strip().lower()

    if not query:
        return jsonify({
            "success": False,
            "message": "Search query required"
        })

    fields_data = load_json("fields.json")
    results = []

    try:
        for field in fields_data.get(
            "fields",
            []
        ):
            field_id = field["id"]

            tools = load_json(
                f"{field_id}.json",
                folder="tools"
            )

            for tool in tools:
                if query in tool.get(
                    "name",
                    ""
                ).lower():

                    results.append({
                        "field": field_id,
                        "tool": tool
                    })

        return jsonify({
            "success": True,
            "total_results": len(results),
            "results": results[:100]
        })

    except Exception as e:
        logging.error(str(e))

        return jsonify({
            "success": False,
            "message": "Search failed"
        }), 500


# =========================================
# CONTACT FORM
# =========================================
@app.route("/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        required_fields = [
            "name",
            "email",
            "subject",
            "message"
        ]

        for field in required_fields:
            if (
                field not in data
                or not data[field].strip()
            ):
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        success = send_to_discord(
            data["name"],
            data["email"],
            data["subject"],
            data["message"]
        )

        if success:
            return jsonify({
                "success": True,
                "message": "Message sent successfully"
            })

        return jsonify({
            "success": False,
            "message": "Discord webhook failed"
        }), 500

    except Exception as e:
        logging.error(str(e))

        return jsonify({
            "success": False,
            "message": "Contact form error"
        }), 500


# =========================================
# HEALTH CHECK
# =========================================
@app.route("/health")
def health():
    return jsonify({
        "status": "running",
        "project": "StackVerse",
        "version": "1.0.0"
    })

# =========================================
# ERROR HANDLERS
# =========================================
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Route not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


# =========================================
# RUN APP
# =========================================
if __name__ == "__main__":
    app.run(
        debug=os.getenv(
            "DEBUG",
            "True"
        ) == "True",

        host="0.0.0.0",

        port=int(
            os.getenv(
                "PORT",
                5000
            )
        )
    )